type FilterState = {
  search: string;
  topic: string;
  sort: string;
};

type FilterEvent = CustomEvent<FilterState>;

const rows = [...document.querySelectorAll<HTMLElement>("[data-post-row]")];
const list = document.querySelector<HTMLElement>("#post-list");
const count = document.querySelector<HTMLElement>("#result-count");
const emptyState = document.querySelector<HTMLElement>("#empty-state");

if (list && count && emptyState) {
  const readFilters = (): FilterState => {
    const params = new URLSearchParams(window.location.search);
    return {
      search: params.get("q") ?? "",
      topic: params.get("topic") ?? "all",
      sort: params.get("sort") ?? "newest",
    };
  };

  const writeFilters = ({ search, topic, sort }: FilterState) => {
    const params = new URLSearchParams(window.location.search);
    search.trim() ? params.set("q", search.trim()) : params.delete("q");
    topic !== "all" ? params.set("topic", topic) : params.delete("topic");
    sort !== "newest" ? params.set("sort", sort) : params.delete("sort");
    const query = params.size ? `?${params}` : "";
    window.history.replaceState({}, "", `${window.location.pathname}${query}`);
  };

  const updatePosts = ({ search, topic, sort }: FilterState) => {
    const query = search.trim().toLowerCase();
    const visibleRows = rows
      .filter((row) => {
        const searchable = [
          row.dataset.title,
          row.dataset.description,
          row.dataset.tags,
        ]
          .filter(Boolean)
          .join(" ");
        return (
          (!query || searchable.includes(query)) &&
          (topic === "all" || (row.dataset.tags ?? "").includes(topic))
        );
      })
      .sort((first, second) => {
        const firstDate = Number(first.dataset.date ?? 0);
        const secondDate = Number(second.dataset.date ?? 0);
        return sort === "newest"
          ? secondDate - firstDate
          : firstDate - secondDate;
      });

    rows.forEach((row) => {
      row.hidden = !visibleRows.includes(row);
    });
    visibleRows.forEach((row) => list.append(row));
    count.textContent = String(visibleRows.length);
    emptyState.hidden = visibleRows.length > 0;
  };

  const handleFilterChange = (event: Event) => {
    const filters = (event as FilterEvent).detail;
    updatePosts(filters);
    writeFilters(filters);
  };

  document.addEventListener("blog-filters-change", handleFilterChange);
  document
    .querySelectorAll<HTMLButtonElement>("[data-topic]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const search =
          document.querySelector<HTMLInputElement>("#search-input")?.value ??
          "";
        document.dispatchEvent(
          new CustomEvent<FilterState>("blog-filters-change", {
            detail: {
              search,
              topic: button.dataset.topic ?? "all",
              sort: "newest",
            },
          }),
        );
      });
    });

  updatePosts(readFilters());
}

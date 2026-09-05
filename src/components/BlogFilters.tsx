import { useState } from "react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type BlogFiltersProps = {
  tags: string[];
};

type FilterState = {
  search: string;
  topic: string;
  sort: string;
};

function getInitialFilters(): FilterState {
  if (typeof window === "undefined") {
    return { search: "", topic: "all", sort: "newest" };
  }

  const params = new URLSearchParams(window.location.search);
  return {
    search: params.get("q") ?? "",
    topic: params.get("topic") ?? "all",
    sort: params.get("sort") ?? "newest",
  };
}

function emitFilters(search: string, topic: string, sort: string) {
  document.dispatchEvent(
    new CustomEvent("blog-filters-change", {
      detail: { search, topic, sort },
    }),
  );
}

export default function BlogFilters({ tags }: BlogFiltersProps) {
  const initialFilters = getInitialFilters();
  const [search, setSearch] = useState(initialFilters.search);
  const [topic, setTopic] = useState(initialFilters.topic);
  const [sort, setSort] = useState(initialFilters.sort);

  return (
    <form
      id="filters"
      className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_10rem_10rem]"
      onSubmit={(event) => event.preventDefault()}
    >
      <label className="flex flex-col gap-2 text-xs font-semibold text-muted-foreground">
        <span>Search the archive</span>
        <Input
          id="search-input"
          type="search"
          placeholder="Try Astro or process"
          autoComplete="off"
          value={search}
          onChange={(event) => {
            const nextSearch = event.currentTarget.value;
            setSearch(nextSearch);
            emitFilters(nextSearch, topic, sort);
          }}
        />
      </label>

      <label className="flex flex-col gap-2 text-xs font-semibold text-muted-foreground">
        <span>Topic</span>
        <Select
          defaultValue={topic}
          onValueChange={(value) => {
            const nextTopic = value ?? "all";
            setTopic(nextTopic);
            emitFilters(search, nextTopic, sort);
          }}
        >
          <SelectTrigger id="tag-filter" className="w-full">
            <SelectValue placeholder="All topics" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All topics</SelectItem>
              {tags.map((tag) => (
                <SelectItem key={tag} value={tag.toLowerCase()}>
                  {tag}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </label>

      <label className="flex flex-col gap-2 text-xs font-semibold text-muted-foreground">
        <span>Sort by</span>
        <Select
          defaultValue={sort}
          onValueChange={(value) => {
            const nextSort = value ?? "newest";
            setSort(nextSort);
            emitFilters(search, topic, nextSort);
          }}
        >
          <SelectTrigger id="sort-filter" className="w-full">
            <SelectValue placeholder="Newest first" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </label>
    </form>
  );
}

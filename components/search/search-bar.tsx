"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, X, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  placeholder?: string
  onSearch?: (query: string) => void
  suggestions?: string[]
  recentSearches?: string[]
  className?: string
  debounceMs?: number
}

export function SearchBar({
  placeholder = "Search...",
  onSearch,
  suggestions = [],
  recentSearches = [],
  className,
  debounceMs = 300,
}: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [recent, setRecent] = useState<string[]>(recentSearches)
  const timeoutRef = useRef<NodeJS.Timeout>()

  // Debounced search
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      if (onSearch && query.trim()) {
        onSearch(query.trim())
      }
    }, debounceMs)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [query, onSearch, debounceMs])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      handleSearch(query.trim())
    }
  }

  const handleSearch = (searchQuery: string) => {
    // Add to recent searches
    setRecent(prev => {
      const filtered = prev.filter(item => item !== searchQuery)
      return [searchQuery, ...filtered].slice(0, 5)
    })
    
    if (onSearch) {
      onSearch(searchQuery)
    }
    setIsOpen(false)
  }

  const clearSearch = () => {
    setQuery("")
    setIsOpen(false)
  }

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className={cn("relative", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="pl-10 pr-10"
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </form>

      {/* Suggestions dropdown */}
      {(isOpen && (filteredSuggestions.length > 0 || recent.length > 0)) && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1">
          <Command className="rounded-md border shadow-md">
            <CommandList>
              {recent.length > 0 && query === "" && (
                <CommandGroup heading="Recent searches">
                  {recent.map((search, index) => (
                    <CommandItem
                      key={index}
                      onSelect={() => handleSearch(search)}
                      className="cursor-pointer"
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      {search}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              
              {filteredSuggestions.length > 0 && (
                <CommandGroup heading="Suggestions">
                  {filteredSuggestions.map((suggestion, index) => (
                    <CommandItem
                      key={index}
                      onSelect={() => handleSearch(suggestion)}
                      className="cursor-pointer"
                    >
                      <Search className="mr-2 h-4 w-4" />
                      {suggestion}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              
              {query && filteredSuggestions.length === 0 && (
                <CommandEmpty>No suggestions found.</CommandEmpty>
              )}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  )
}

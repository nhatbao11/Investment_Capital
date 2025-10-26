import { useState, useEffect, useCallback, useMemo } from 'react';

/**
 * Optimized data fetching hook với caching và error handling
 */
export const useOptimizedData = <T>(
  fetchFunction: () => Promise<T>,
  dependencies: any[] = [],
  options: {
    enabled?: boolean;
    cacheTime?: number;
    staleTime?: number;
    retryCount?: number;
  } = {}
) => {
  const {
    enabled = true,
    cacheTime = 5 * 60 * 1000, // 5 phút
    staleTime = 1 * 60 * 1000, // 1 phút
    retryCount = 3
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<number>(0);

  const fetchData = useCallback(async (retryAttempt = 0) => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError(null);

      const result = await fetchFunction();
      setData(result);
      setLastFetch(Date.now());
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch data';
      
      if (retryAttempt < retryCount) {
        console.log(`Retrying fetch (attempt ${retryAttempt + 1}/${retryCount})`);
        setTimeout(() => fetchData(retryAttempt + 1), 1000 * (retryAttempt + 1));
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, enabled, retryCount]);

  // Kiểm tra cache và fetch nếu cần
  useEffect(() => {
    const now = Date.now();
    const isStale = now - lastFetch > staleTime;
    const isExpired = now - lastFetch > cacheTime;

    if (isExpired || (!data && enabled)) {
      fetchData();
    } else if (isStale && enabled) {
      // Fetch trong background để update cache
      fetchData();
    }
  }, dependencies);

  const refetch = useCallback(() => {
    setLastFetch(0); // Force refresh
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
    isStale: Date.now() - lastFetch > staleTime
  };
};

/**
 * Optimized pagination hook
 */
export const useOptimizedPagination = <T>(
  fetchFunction: (page: number, limit: number) => Promise<{
    data: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }>,
  initialPage = 1,
  initialLimit = 10
) => {
  const [data, setData] = useState<T[]>([]);
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: initialLimit,
    total: 0,
    pages: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(async (page: number, limit: number = initialLimit) => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetchFunction(page, limit);
      setData(result.data);
      setPagination(result.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, initialLimit]);

  const goToPage = useCallback((page: number) => {
    fetchPage(page, pagination.limit);
  }, [fetchPage, pagination.limit]);

  const changeLimit = useCallback((limit: number) => {
    fetchPage(1, limit); // Reset về trang 1 khi thay đổi limit
  }, [fetchPage]);

  useEffect(() => {
    fetchPage(initialPage, initialLimit);
  }, []);

  return {
    data,
    pagination,
    loading,
    error,
    goToPage,
    changeLimit,
    refetch: () => fetchPage(pagination.page, pagination.limit)
  };
};

/**
 * Optimized search hook với debouncing
 */
export const useOptimizedSearch = <T>(
  searchFunction: (query: string) => Promise<T[]>,
  debounceMs = 300
) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    
    return (searchQuery: string) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        if (searchQuery.trim()) {
          try {
            setLoading(true);
            setError(null);
            const searchResults = await searchFunction(searchQuery);
            setResults(searchResults);
          } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Search failed');
          } finally {
            setLoading(false);
          }
        } else {
          setResults([]);
        }
      }, debounceMs);
    };
  }, [searchFunction, debounceMs]);

  const handleSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
    debouncedSearch(searchQuery);
  }, [debouncedSearch]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
  }, []);

  return {
    query,
    results,
    loading,
    error,
    handleSearch,
    clearSearch
  };
};

/**
 * Optimized infinite scroll hook
 */
export const useOptimizedInfiniteScroll = <T>(
  fetchFunction: (page: number, limit: number) => Promise<{
    data: T[];
    hasMore: boolean;
    nextPage: number;
  }>,
  limit = 10
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      setError(null);

      const result = await fetchFunction(currentPage, limit);
      
      setData(prev => [...prev, ...result.data]);
      setHasMore(result.hasMore);
      setCurrentPage(result.nextPage);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load more data');
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, currentPage, limit, loading, hasMore]);

  const reset = useCallback(() => {
    setData([]);
    setCurrentPage(1);
    setHasMore(true);
    setError(null);
  }, []);

  useEffect(() => {
    loadMore();
  }, []);

  return {
    data,
    loading,
    error,
    hasMore,
    loadMore,
    reset
  };
};

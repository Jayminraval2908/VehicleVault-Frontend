import { useState, useEffect } from "react";

export const useFetch = (fetchFunction, params = null) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetchFunction(params);
        setData(result.data);
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [JSON.stringify(params), fetchFunction]);

  return { data, loading, error, setData };
};
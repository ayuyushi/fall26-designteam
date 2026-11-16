import 'server-only'

type SupabaseQueryResponse<T> = {
  data: T;
  error: {
    message: string;
    code?: string;
  } | null;
  count?: number | null;
}

type QueryResult<T> = {
  data: T | null;
  error: string | null;
  count?: number | null;
}

export async function executeSupabaseQuery<T>(
  query: PromiseLike<SupabaseQueryResponse<T>>,
  operation: string,
  failureMessage: string
): Promise<QueryResult<T>> {
  let response: SupabaseQueryResponse<T>;
  
  try {
    response = await query;
  } catch (error) {
    console.error(`Supabase ${operation} request failed:`, error);
    return { data: null, error: failureMessage };
  }

  if (response.error) {
    console.error(`Supabase ${operation} failed:`, response.error);
    return {
      data: null,
      error: failureMessage,
      count: response.count,
    };
  }

  return {
    data: response.data,
    error: null,
    count: response.count,
  };
}

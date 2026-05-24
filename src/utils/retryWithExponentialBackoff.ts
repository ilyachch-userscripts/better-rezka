export async function retryWithExponentialBackoff<T>(
  task: () => Promise<T>,
  signal: AbortSignal | null | undefined,
  maxRetries = 5,
  initialDelay = 1000,
): Promise<T> {
  let delay = initialDelay;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await task();
    } catch (error) {
      if (attempt === maxRetries || signal?.aborted) {
        throw error;
      }

      console.warn(`Attempt ${attempt} failed. Retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2;
    }
  }

  throw new Error('Retry loop finished without returning a result.');
}

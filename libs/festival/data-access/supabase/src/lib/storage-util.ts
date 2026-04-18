export const getBucketAndPath = (storagePath: string | null) => {
  if (!storagePath) {
    return [null, null];
  }

  const normalizedStoragePath = storagePath.replace(/^\/+/, '');
  const [bucket, ...path] = normalizedStoragePath.split('/');

  return [bucket, path.join('/')];
};

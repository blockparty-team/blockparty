export const getBucketAndPath = (storagePath: string | null) => {
  if (!storagePath) {
    return [null, null];
  }

  const [bucket, ...path] = storagePath.split('/');

  return [bucket, path.join('/')];
};

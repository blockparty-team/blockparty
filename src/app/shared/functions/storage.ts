export const getBucketAndPath = (storagePath: string) => {
    if (!storagePath) {
        return [null, null];
    }

    const [bucket, ...path] = storagePath.split('/')

    return [bucket, path.join('/')];
}
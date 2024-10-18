export const isMainModule = (mod: NodeModule): boolean => {
    return mod === require.main;
}

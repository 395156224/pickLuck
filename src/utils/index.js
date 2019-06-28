/**
 * 合并数据
 * @param {上下文} requireContext
 * @param {排除文件} exinclude
 */
export const mergerAllData = (
    requireContext,
    exinclude = /index/,
    fn = argv => argv
) => {
    const sourceMap = {}
    const paths = requireContext.keys().filter(p => {
        return !exinclude.test(p)
    })
    for (let p of paths) {
        const ss = fn(requireContext(p))
        const name = p.replace(/\.\/(\w+)\.js/g, '$1')

        sourceMap[name] = ss
    }
    return sourceMap
}
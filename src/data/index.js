import { mergerAllData } from '@/utils'

const allData = mergerAllData(require.context('./', true, /\w+\.js/))
export default allData
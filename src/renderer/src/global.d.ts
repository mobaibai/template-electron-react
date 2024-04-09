var isDev: boolean

type JSONValue = string | number | boolean | null | { [k: string]: JSONValue } | JSONValue[]

type RequestQueryType = {
  query: Record<string, string>
}

type ItemType = {
  id?: string | number
}

type ResponseDataListType = {
  list: ItemType[]
  query: E
  pages: {
    page: number
    per: number
    total_page: number
  }
}

type DataType<R> = {
  code: number
  data: E
}

type SettingConf = {
  interest: {
    val24: string | null
    val36: string | null
    val48: string | null
    val60: string | null
  }
  tableText: string
  plateFee: string | null
  saveImgPath: string
}

type SystemInfo = {
  key: string
  name: string
  value: string | T[]
}

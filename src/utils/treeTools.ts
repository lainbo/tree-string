interface TreeNode {
  children?: TreeNode[]
  [key: string]: any
}

/**
 * @description: 递归树形结构，对每个节点进行操作，会修改原来的树形结构
 * @param {Array} data 树数据
 * @param {Function} callback 要对每个节点做什么
 */
export function treeTraversal(data: TreeNode[] = [], callback: (node: any) => void) {
  for (let i = 0; i < data.length; i++) {
    const item = data[i]
    callback && callback(item)
    if (item?.children && item?.children?.length > 0) {
      treeTraversal(item?.children, callback)
    }
  }
}

/**
 * @description: 递归树形结构，对每个节点进行操作后返回新的树形结构，不会修改原来的树形结构
 * @param data 没有根节点的树形结构
 * @param callback 要对每个节点做什么
 * @returns 修改后的树形结构
 */
export function recursiveTree<T>(data: TreeNode[], callback: (item: T) => void) {
  const copiedData: TreeNode[] = JSON.parse(JSON.stringify(data))
  function recursiveTree(data: TreeNode[]) {
    for (const item of data) {
      if (item === null || item === undefined) {
        continue
      }
      callback(item as any as T)
      if (item?.children) {
        recursiveTree(item?.children)
      }
    }
  }
  recursiveTree(copiedData)
  return copiedData
}

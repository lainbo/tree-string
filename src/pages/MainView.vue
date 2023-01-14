<template>
  <div class="p-24px h-full">
    <div class="grid gap-24px grid-cols-2 w-full h-full">
      <div class="page-card">
        <div class="mb-16px">
          <el-button @click="插入根节点()">插入根节点</el-button>
        </div>
        <el-tree
          :data="树形结构"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
        >
          <template #default="{ node, data }">
            <span class="flex-1 flex items-center justify-between pr-8px">
              <span>{{ node.label }}</span>
              <span>
                <el-button link type="primary" @click="append(data)">
                  在此节点下添加
                </el-button>
                <el-button link type="danger" @click="remove(node, data)">
                  删除该节点
                </el-button>
              </span>
            </span>
          </template>
        </el-tree>
      </div>
      <div class="page-card">
        <pre class="whitespace-pre-wrap">{{ displayTree }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nanoid } from 'nanoid'
import dayjs from 'dayjs'
interface Tree {
  id: string
  label: string
  children?: Tree[]
}
const 树形结构 = ref<Tree[]>([
  {
    id: '1',
    label: 'example',
  },
  {
    id: '3',
    label: 'example-2',
    children: [
      {
        id: '2',
        label: 'example-1',
      },
      {
        id: '4',
        label: 'example-3',
      },
    ],
  },
])

const append = (data: Tree) => {
  const newChild = { id: nanoid(), label: 'testtest', children: [] }
  if (!data.children) {
    data.children = []
  }
  data.children.push(newChild)
  树形结构.value = [...树形结构.value]
}

const remove = (node: Node, data: Tree) => {
  const parent = node.parent
  const children: Tree[] = parent.data.children || parent.data
  const index = children.findIndex(d => d.id === data.id)
  children.splice(index, 1)
  树形结构.value = [...树形结构.value]
}

function 插入根节点() {
  const 节点 = {
    id: nanoid(),
    label: `新节点${dayjs().format('YYYY-MM-DD HH:mm:ss')}`,
  }
  树形结构.value.push(节点)
}
const displayTree = computed(() => {
  /**
   * 将树形结构转换为可显示的字符串树
   * @param tree 当前要处理的树节点
   * @param indent 当前节点的缩进字符串
   * @param isTail 当前节点是否是其父节点的末尾节点
   * @param isRoot 当前节点是否是根节点
   * @returns 可显示的字符串树
   */
  function generateString(tree: Tree, indent = '', isTail = true, isRoot = true): string {
    let str = ''
    if (!isRoot || (isRoot && 树形结构.value.length > 1)) {
      // 如果不是根节点或者是根节点但根节点不止一个，添加符号
      str = `${indent}${isTail ? '└─ ' : '├─ '}${tree.label}\n`
    } else {
      // 如果是根节点且根节点只有一个，不添加符号
      str = `${tree.label}\n`
    }
    // 如果当前节点有子节点
    if (tree.children && tree.children.length) {
      // 遍历子节点
      tree.children.forEach((child, index) => {
        // 定义子节点的缩进
        const childIndent = indent + (isTail ? ' ' : '│ ')
        // 递归调用generateString函数, 传入子节点、子节点缩进、当前子节点是否是末尾节点、false
        str += generateString(
          child,
          childIndent,
          index === tree.children.length - 1,
          false
        )
      })
    }
    // 返回字符串树
    return str
  }

  return 树形结构.value
    .map((tree, index) => generateString(tree, '', index === 树形结构.value.length - 1))
    .join('')
})
</script>

<style lang="scss" scoped></style>

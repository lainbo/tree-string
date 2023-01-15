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
  function generateString(tree: Tree, indent = '', isTail = true, isRoot = true): string {
    let str = ''
    if (!isRoot || (isRoot && 树形结构.value.length > 1)) {
      str = `${indent}${isTail ? '└── ' : '├── '}${tree.label}\n`
    } else {
      str = `${tree.label}\n`
    }
    if (tree.children && tree.children.length) {
      tree.children.forEach((child, index) => {
        const childIndent = indent + (isTail ? '    ' : '│   ')
        str += generateString(
          child,
          childIndent,
          index === tree.children.length - 1,
          false
        )
      })
    }
    return str
  }
  let isLast = false
  let str = ''
  const traverse = tree => {
    tree.forEach((child, index) => {
      isLast = index === tree.length - 1
      str += generateString(child, '', isLast, false)
    })
  }
  traverse(树形结构.value)
  return str
})
</script>

<style lang="scss" scoped></style>

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
          draggable
          class="main_tree"
        >
          <template #default="{ node, data }">
            <span class="flex-1 flex items-center justify-between pr-8px node_line">
              <div class="space-x-8px text-16px">
                <span v-if="!data.isEdit">{{ data.label }}</span>
                <el-input
                  v-else
                  ref="inputRef"
                  v-model="data.label"
                  :style="{ width: '200px' }"
                  @blur="编辑提交(data)"
                >
                </el-input>
                <i
                  v-if="!data.isEdit"
                  i-mingcute-edit-3-line
                  class="text-18px invisible hover:(c-blue i-mingcute-edit-3-fill)"
                  @click.stop="编辑节点文字(data)"
                ></i>
              </div>
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
import { treeTraversal } from '@/utils/treeTools'
interface Tree {
  id: string
  label: string
  isEdit: boolean
  children?: Tree[]
}
const 树形结构 = ref<Tree[]>([
  { id: '1', label: '节点 1', isEdit: false },
  {
    id: '2',
    label: '节点 2',
    isEdit: false,
    children: [{ id: '3', label: '节点 2-1', isEdit: false }],
  },
])

function append(data: Tree) {
  const newChild = {
    id: nanoid(),
    label: `新节点${dayjs().format('HH:mm:ss')}`,
    isEdit: false,
    children: [],
  }
  if (!data.children) {
    data.children = []
  }
  data.children.push(newChild)
  树形结构.value = [...树形结构.value]
}
function 编辑提交(node: any) {
  node.isEdit = false
}
const inputRef = ref()
function 编辑节点文字(data: Tree) {
  treeTraversal(树形结构.value, (item: Tree) => (item.isEdit = false))
  data.isEdit = true
  nextTick(() => {
    inputRef.value.focus()
  })
}

function remove(node: any, data: Tree) {
  const parent = node.parent
  const children: Tree[] = parent.data.children || parent.data
  const index = children.findIndex(d => d.id === data.id)
  children.splice(index, 1)
  树形结构.value = [...树形结构.value]
}

function 插入根节点() {
  const 节点 = {
    id: nanoid(),
    label: `新节点${dayjs().format('HH:mm:ss')}`,
    isEdit: false,
  }
  树形结构.value.push(节点)
}
interface Tree {
  id: string
  label: string
  children?: Tree[]
}

const displayTree = computed<string>(() => {
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
        const idx = tree.children ? tree.children.length - 1 : false
        str += generateString(child, childIndent, index === idx, false)
      })
    }
    return str
  }
  let isLast = false
  let str = ''
  const traverse = (tree: Tree[]) => {
    tree.forEach((child, index) => {
      isLast = index === tree.length - 1
      str += generateString(child, '', isLast, tree.length === 1)
    })
  }

  traverse(树形结构.value as Tree[])
  return str
})
</script>

<style lang="scss" scoped>
.node_line {
  &:hover {
    i {
      visibility: visible;
    }
  }
}
.main_tree {
  :deep(.el-tree-node__content) {
    height: 36px;
  }
}
</style>

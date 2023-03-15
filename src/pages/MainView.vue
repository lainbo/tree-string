<template>
  <div class="px-24px pt-0 py-40px">
    <div class="grid gap-32px grid-cols-2 w-full h-full lt-md:grid-cols-1">
      <div class="page-card flex flex-col overflow-hidden pr-0">
        <div class="mb-16px flex justify-between">
          <div>
            <el-button type="primary" @click="插入根节点()">插入根节点</el-button>
            <el-button type="danger" plain @click="重置数据()">重置数据</el-button>
          </div>
          <div class="flex items-center space-x-8px pr-16px">
            <span>节点拖拽</span>
            <el-switch v-model="treeDrag" />
          </div>
        </div>
        <el-tree
          :data="树形结构.data"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
          :draggable="treeDrag"
          class="main_tree flex-1 overflow-scroll"
        >
          <template #default="{ node, data }">
            <span
              class="flex-1 flex items-center justify-between h-full pr-8px node_line"
            >
              <div class="space-x-8px text-16px">
                <span v-if="!data.isEdit">{{ data.label || '-' }}</span>
                <el-input
                  v-else
                  ref="inputRef"
                  v-model="data.label"
                  clearable
                  :style="{ width: '200px' }"
                  @blur="编辑提交(data)"
                >
                </el-input>
                <i
                  v-if="!data.isEdit"
                  i-mingcute-edit-3-line
                  text="18px hover:primary"
                  class="invisible hover:i-mingcute-edit-3-fill"
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
      <div class="page-card flex flex-col overflow-hidden">
        <div class="flex justify-end mb-8px">
          <el-button @click="复制字符()">
            <i i-ic-baseline-content-copy></i>
          </el-button>
        </div>

        <pre
          text="16px #606266 dark:#cfd3dc"
          class="whitespace-pre-wrap flex-1 overflow-scroll font-500"
          >{{ displayTree }}</pre
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { customAlphabet } from 'nanoid'
import { treeTraversal } from '@/utils/treeTools'
const str = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_'
const nanoid = customAlphabet(str, 10)
interface Tree {
  id: string
  label: string
  isEdit: boolean
  children?: Tree[]
}
const 树形数据原始数据 = [
  { id: '1', label: '节点1', isEdit: false },
  {
    id: '2',
    label: '节点2',
    isEdit: false,
    children: [{ id: '3', label: '节点2-1', isEdit: false }],
  },
]
const 树形结构 = useStorage('TREEDATA', { data: cloneDeep(树形数据原始数据) })

const displayTree = computed<string>(() => {
  function generateString(tree: Tree, indent = '', isTail = true, isRoot = true): string {
    let str = ''
    if (!isRoot || (isRoot && 树形结构.value.data.length > 1)) {
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

  traverse(树形结构.value.data as Tree[])
  return str
})

const treeDrag = ref(false)

const { copy } = useClipboard({ source: displayTree.value })
function 复制字符() {
  copy(displayTree.value)
  ElMessage({
    message: '复制成功',
    grouping: true,
    type: 'success',
  })
}
function append(data: Tree) {
  if (!data.children) {
    data.children = []
  }
  data.children.push(返回一个节点())
  树形结构.value.data = [...树形结构.value.data]
}
function 编辑提交(node: any) {
  node.isEdit = false
}
const inputRef = ref()
function 编辑节点文字(data: Tree) {
  treeTraversal(树形结构.value.data, (item: Tree) => (item.isEdit = false))
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
  树形结构.value.data = [...树形结构.value.data]
}

function 插入根节点() {
  树形结构.value.data.push(返回一个节点())
}

function 重置数据() {
  树形结构.value.data = cloneDeep(树形数据原始数据)
}

function 返回一个节点(): Tree {
  return {
    id: nanoid(),
    label: `新节点${nanoid()}`,
    isEdit: false,
    children: [],
  }
}
interface Tree {
  id: string
  label: string
  children?: Tree[]
}
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
  :deep(.ep-tree-node__content) {
    height: 36px;
  }
}
</style>

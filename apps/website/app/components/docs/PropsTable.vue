<script setup lang="ts">
  import type { PropRow } from '@/data/components';
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';

  defineProps<{ rows: PropRow[] }>();
</script>

<template>
  <div class="overflow-x-auto border-y border-border">
    <Table class="min-w-[640px] table-fixed">
      <TableHeader>
        <TableRow>
          <TableHead class="w-[20%] font-mono text-[10px] tracking-wider uppercase">Prop</TableHead>
          <TableHead class="w-[30%] font-mono text-[10px] tracking-wider uppercase">Type</TableHead>
          <TableHead class="w-[15%] font-mono text-[10px] tracking-wider uppercase"
            >Default</TableHead
          >
          <TableHead class="font-mono text-[10px] tracking-wider uppercase">Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
          v-for="row in rows"
          :key="row.name"
          class="odd:bg-muted/30 hover:bg-muted/70"
        >
          <TableCell
            class="align-top font-mono text-xs font-medium break-words whitespace-normal"
            >{{ row.name }}</TableCell
          >
          <TableCell
            class="align-top font-mono text-[11px] leading-5 [overflow-wrap:anywhere] whitespace-normal text-muted-foreground"
            >{{ row.type }}</TableCell
          >
          <TableCell
            class="align-top font-mono text-xs break-words whitespace-normal text-muted-foreground"
          >
            {{ row.default ?? '—' }}
          </TableCell>
          <TableCell class="align-top text-xs leading-6 whitespace-normal text-muted-foreground">{{
            row.description
          }}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

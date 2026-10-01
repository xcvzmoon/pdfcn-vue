<script setup lang="ts">
  import {
    Checkbox,
    Document,
    Dropdown,
    H1,
    Page,
    RadioButton,
    Text,
    TextField,
  } from '@formepdf/vue';

  defineProps<{ fullName?: string }>();
</script>

<template>
  <Document
    title="Contact preferences"
    lang="en"
  >
    <Page
      size="A4"
      :margin="48"
    >
      <H1>Contact preferences</H1>
      <Text>Full name</Text>
      <TextField
        name="fullName"
        :value="fullName ?? 'Ada Lovelace'"
        :width="260"
      />
      <Text>Department</Text>
      <Dropdown
        name="department"
        :options="['Engineering', 'Support']"
        value="Engineering"
        :width="260"
      />
      <Text>Send product updates</Text>
      <Checkbox
        name="updates"
        :checked="true"
      />
      <Text>Contact by email</Text>
      <RadioButton
        name="contactMethod"
        value="email"
        :checked="true"
      />
      <Text>Contact by phone</Text>
      <RadioButton
        name="contactMethod"
        value="phone"
      />
    </Page>
  </Document>
</template>

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './sanity/schemas';
import { projectId, dataset } from './sanity/env';

export default defineConfig({
  name: 'deaflms-studio',
  title: 'DeafLMS Content Management System',
  basePath: '/admin/content',
  projectId,
  dataset,
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
});

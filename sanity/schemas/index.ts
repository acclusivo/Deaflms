import { course } from './course';
import { courseModule } from './courseModule';
import { lesson } from './lesson';
import { vocabularyItem } from './vocabularyItem';
import { signVideo } from './signVideo';
import { visualStoryFrame } from './visualStoryFrame';
import { learningPath } from './learningPath';

export const schemaTypes = [
  learningPath,
  course,
  courseModule,
  lesson,
  vocabularyItem,
  signVideo,
  visualStoryFrame,
];

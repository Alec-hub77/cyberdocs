export type Difficulty = "beginner" | "intermediate" | "advanced";
export type ContentSource = "static" | "custom";

export interface Heading {
  level: number;
  text: string;
  id: string;
}

export interface ArticleMeta {
  slug: string;
  title: string;
  description: string;
  category: string;
  difficulty: Difficulty;
  tags: string[];
  date: string;
  relatedTools: string[];
  relatedCommands: string[];
  readTime: number;
  source: ContentSource;
}

export interface ArticleFull extends ArticleMeta {
  contentHtml: string;
  headings: Heading[];
}

export interface EditableArticle {
  slug: string;
  title: string;
  description: string;
  category: string;
  difficulty: Difficulty;
  tags: string[];
  content: string;
}

export interface CustomArticleRecord extends EditableArticle {
  date: string;
  relatedTools: string[];
  relatedCommands: string[];
  createdAt: number;
  updatedAt?: number;
}

export interface ArticleInput {
  title: string;
  description?: string;
  category?: string;
  difficulty?: string;
  tags?: string[];
  content: string;
}

export interface CommandItem {
  cmd: string;
  desc: string;
}

export interface Tool {
  id: string;
  name: string;
  category: string;
  difficulty: Difficulty;
  summary: string;
  site: string;
  tags: string[];
  useCase: string;
  commands: CommandItem[];
  source: ContentSource;
  createdAt?: number;
  updatedAt?: number;
}

export interface EditableTool {
  id: string;
  name: string;
  category: string;
  difficulty: Difficulty;
  summary: string;
  site: string;
  tags: string[];
  useCase: string;
  commands: CommandItem[];
}

export interface ToolInput {
  name: string;
  category?: string;
  difficulty?: string;
  summary?: string;
  site?: string;
  tags?: string[];
  useCase?: string;
  commands?: CommandItem[];
}

export interface CommandGroup {
  id: string;
  title: string;
  tool: string;
  items: CommandItem[];
  source: ContentSource;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: number;
  updatedAt?: number;
}

export interface NoteRendered extends Note {
  contentHtml: string;
}

export interface EditableNote {
  id: string;
  title: string;
  content: string;
  tags: string[];
}

export interface NoteInput {
  title?: string;
  content: string;
  tags?: string[];
}

export interface RoadmapItem {
  id: string;
  title: string;
  article?: string;
  tool?: string;
}

export interface RoadmapStage {
  id: string;
  title: string;
  description: string;
  items: RoadmapItem[];
}

export type SearchEntryType = "article" | "tool" | "command" | "note";

export interface SearchEntry {
  type: SearchEntryType;
  id: string;
  title: string;
  description: string;
  href: string;
  tags: string[];
}

export interface AuthUser {
  sub: string;
  email?: string;
}

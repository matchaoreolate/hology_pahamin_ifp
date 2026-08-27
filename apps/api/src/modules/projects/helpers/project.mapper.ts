export function parseJsonField(raw: string | null): Record<string, any> | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function formatProject(project: any) {
  if (!project) return null;
  return {
    ...project,
    presentationData: parseJsonField(project.presentationData),
    lkpdData: parseJsonField(project.lkpdData),
    ebookData: parseJsonField(project.ebookData),
  };
}

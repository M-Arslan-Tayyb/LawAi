interface HtmlRendererProps {
  htmlContent: string;
  className?: string;
}

export function HtmlRenderer({
  htmlContent,
  className = "",
}: HtmlRendererProps) {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}

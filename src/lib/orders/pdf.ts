export function orderPdf(lines: string[]): Buffer {
  const wrapped = lines.flatMap((line) => {
    const chunks: string[] = [];
    for (let rest = line; rest.length; rest = rest.slice(54))
      chunks.push(rest.slice(0, 54));
    return chunks.length ? chunks : [""];
  });
  const pages: string[][] = [];
  for (let i = 0; i < wrapped.length; i += 45)
    pages.push(wrapped.slice(i, i + 45));
  if (!pages.length) pages.push([]);
  const objects: string[] = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
  ];
  const pageIds: number[] = [];
  for (const page of pages) {
    const id = objects.length + 1;
    pageIds.push(id);
    objects.push(
      "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents " +
        (id + 1) +
        " 0 R >>",
    );
    const text = page
      .map(
        (line, i) =>
          "1 0 0 1 40 " +
          (800 - i * 16) +
          " Tm (" +
          line
            .replace(/[^\x20-\x7e\xa0-\xff]/g, " ")
            .replace(/([\\()])/g, "\\$1") +
          ") Tj",
      )
      .join("\n");
    const stream = "BT /F1 10 Tf\n" + text + "\nET";
    objects.push(
      "<< /Length " +
        Buffer.byteLength(stream, "latin1") +
        " >>\nstream\n" +
        stream +
        "\nendstream",
    );
  }
  objects[1] =
    "<< /Type /Pages /Kids [" +
    pageIds.map((id) => id + " 0 R").join(" ") +
    "] /Count " +
    pages.length +
    " >>";
  let output = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
  const offsets = [0];
  objects.forEach((obj, i) => {
    offsets.push(Buffer.byteLength(output, "latin1"));
    output += i + 1 + " 0 obj\n" + obj + "\nendobj\n";
  });
  const xref = Buffer.byteLength(output, "latin1");
  output +=
    "xref\n0 " +
    offsets.length +
    "\n0000000000 65535 f \n" +
    offsets
      .slice(1)
      .map((n) => String(n).padStart(10, "0") + " 00000 n \n")
      .join("") +
    "trailer\n<< /Size " +
    offsets.length +
    " /Root 1 0 R >>\nstartxref\n" +
    xref +
    "\n%%EOF";
  return Buffer.from(output, "latin1");
}

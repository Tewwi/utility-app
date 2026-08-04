type PdfOperatorList = {
  fnArray: number[];
  argsArray: unknown[][];
};

type PdfOperatorCodes = Record<string, number>;

export function isInvisibleTextScan(
  operatorList: PdfOperatorList,
  operators: PdfOperatorCodes,
): boolean {
  const imageOperators = new Set(
    [
      operators.paintImageMaskXObject,
      operators.paintImageMaskXObjectGroup,
      operators.paintImageMaskXObjectRepeat,
      operators.paintImageXObject,
      operators.paintImageXObjectRepeat,
      operators.paintInlineImageXObject,
      operators.paintInlineImageXObjectGroup,
      operators.paintSolidColorImageMask,
    ].filter((operator): operator is number => Number.isFinite(operator)),
  );
  const textOperators = new Set(
    [
      operators.showText,
      operators.showSpacedText,
      operators.nextLineShowText,
      operators.nextLineSetSpacingShowText,
    ].filter((operator): operator is number => Number.isFinite(operator)),
  );

  let textRenderingMode = 0;
  let imageCount = 0;
  let invisibleTextCount = 0;
  let visibleTextCount = 0;

  for (let index = 0; index < operatorList.fnArray.length; index += 1) {
    const operator = operatorList.fnArray[index];

    if (operator === operators.setTextRenderingMode) {
      const mode = operatorList.argsArray[index]?.[0];
      textRenderingMode = typeof mode === "number" ? mode : 0;
      continue;
    }

    if (imageOperators.has(operator)) {
      imageCount += 1;
      continue;
    }

    if (!textOperators.has(operator)) continue;

    if (textRenderingMode === 3 || textRenderingMode === 7) {
      invisibleTextCount += 1;
    } else {
      visibleTextCount += 1;
    }
  }

  return imageCount > 0 && invisibleTextCount > 0 && visibleTextCount === 0;
}

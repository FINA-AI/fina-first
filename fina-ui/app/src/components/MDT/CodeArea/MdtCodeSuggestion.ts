import { LanguageSupport, syntaxTree } from "@codemirror/language";
import { javascriptLanguage } from "@codemirror/lang-javascript";

const MdtCodeSuggestion = (validMDTCODES?: string[]) => {
  const tagOptions = validMDTCODES?.map((tag) => ({
    label: "@" + tag,
    type: "keyword",
    apply: tag,
  }));

  function completeFunctionMdtCode(context: any) {
    let nodeBefore = syntaxTree(context.state).resolveInner(context.pos, -1);
    if (
      nodeBefore.name != "String" ||
      context.state.sliceDoc(nodeBefore.to - 1, nodeBefore.to) != '"'
    )
      return null;
    let textBefore = context.state.sliceDoc(nodeBefore.from, context.pos);
    let tagBefore = /@\w*$/.exec(textBefore);

    if (!tagBefore && !context.explicit) return null;
    return {
      from: tagBefore ? nodeBefore.from + tagBefore.index : context.pos,
      options: tagOptions,
      validFor: /^(@\w.*)?$/,
    };
  }
  const exampleCompletion = javascriptLanguage.data.of({
    autocomplete: completeFunctionMdtCode,
  });
  return new LanguageSupport(javascriptLanguage, [exampleCompletion]);
};

export default MdtCodeSuggestion;

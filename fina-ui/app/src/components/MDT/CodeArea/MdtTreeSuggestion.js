import { LanguageSupport } from "@codemirror/language";
import { javascriptLanguage } from "@codemirror/lang-javascript";

const MdtTreeSuggestion = (metadata) => {
  const suggestions = metadata.map((m) => {
    var args = "";
    m.argumentTypes.forEach((arg) => {
      switch (arg) {
        case "MDTCODE":
        case "String":
          args += '""';
          break;
        case "Number":
          args += 0;
          break;
      }
      args += ",";
    });

    m.label = m.name;
    m.type = "function";
    m.apply = `${m.name}(${args.substring(0, args.length - 1)})`;
    return m;
  });
  const codeComplettions = (context) => {
    let word = context.matchBefore(/\w*/);
    if (word.from == word.to && !context.explicit) return null;
    return {
      from: word.from,
      options: [{ label: "tree.", type: "keyword" }, ...suggestions],
    };
  };

  const exampleCompletion = javascriptLanguage.data.of({
    autocomplete: codeComplettions,
  });
  return new LanguageSupport(javascriptLanguage, [exampleCompletion]);
};

export default MdtTreeSuggestion;

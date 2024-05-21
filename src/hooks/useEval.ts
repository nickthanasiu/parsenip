import { useState } from "react";
import { evaluate } from "../interpreter/evaluator";
import { parse } from "../interpreter/parser";
import { toString } from "../interpreter/object";
import { Environment } from "../interpreter/environment";

export function useEval() {
    const [evalResult, setEvalResult] = useState('');
    
    const updateEvalResult = (input: string) => {
      const [program, _] = parse(input);
      const result = evaluate(program, new Environment());
      setEvalResult(toString(result));
    };
  
    return [evalResult, updateEvalResult] as const;
  }
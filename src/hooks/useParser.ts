import { useState, useEffect } from "react";
import { parse } from "../interpreter/parser";
import { Program } from "../interpreter/ast";

export function useParser(input: string) {
    const [parser, setParser] = useState<[Program, string[]]>(
      parse(input)
    );
    
    useEffect(() => {
      setParser(parse(input));
    }, [input]);
  
    return parser;
  }
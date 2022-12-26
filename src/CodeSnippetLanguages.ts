// Copyright (c) 2020, jupytercalpoly
// Distributed under the terms of the BSD-3 Clause License.

import { LabIcon } from '@jupyterlab/ui-components';

import babelSVGstr from '../style/icon/language_icons/babel.svg';
import cSVGstr from '../style/icon/language_icons/c.svg';
import clojureSVGstr from '../style/icon/language_icons/clojure.svg';
import coconutSVGstr from '../style/icon/language_icons/coconut.svg';
import coffeescriptSVGstr from '../style/icon/language_icons/coffeescript.svg';
import cppSVGstr from '../style/icon/language_icons/cpp.svg';
import csharpSVGstr from '../style/icon/language_icons/csharp.svg';
import erlangSVGstr from '../style/icon/language_icons/erlang.svg';
import forthSVGstr from '../style/icon/language_icons/forth.svg';
import fortranSVGstr from '../style/icon/language_icons/fortran.svg';
import fsharpSVGstr from '../style/icon/language_icons/fsharp.svg';
import goSVGstr from '../style/icon/language_icons/go.svg';
import groovySVGstr from '../style/icon/language_icons/groovy.svg';
import haskellSVGstr from '../style/icon/language_icons/haskell.svg';
import javaSVGstr from '../style/icon/language_icons/java.svg';
import javascriptSVGstr from '../style/icon/language_icons/javascript.svg';
import juliaSVGstr from '../style/icon/language_icons/julia.svg';
import kotlinSVGstr from '../style/icon/language_icons/kotlin.svg';
import lispSVGstr from '../style/icon/language_icons/lisp.svg';
import livescriptSVGstr from '../style/icon/language_icons/livescript.svg';
import luaSVGstr from '../style/icon/language_icons/lua.svg';
import matlabSVGstr from '../style/icon/language_icons/matlab.svg';
import nodejsSVGstr from '../style/icon/language_icons/nodejs.svg';
import ocamlSVGstr from '../style/icon/language_icons/ocaml.svg';
import perlSVGstr from '../style/icon/language_icons/perl.svg';
import phpSVGstr from '../style/icon/language_icons/php.svg';
import processingSVGstr from '../style/icon/language_icons/processing.svg';
import prologSVGstr from '../style/icon/language_icons/prolog.svg';
import purescriptSVGstr from '../style/icon/language_icons/purescript.svg';
import qsharpSVGstr from '../style/icon/language_icons/qsharp.svg';
import rubySVGstr from '../style/icon/language_icons/ruby.svg';
import rustSVGstr from '../style/icon/language_icons/rust.svg';
import sasSVGstr from '../style/icon/language_icons/sas.svg';
import sbtSVGstr from '../style/icon/language_icons/sbt.svg';
import scalaSVGstr from '../style/icon/language_icons/scala.svg';
import schemeSVGstr from '../style/icon/language_icons/scheme.svg';
import typescriptSVGstr from '../style/icon/language_icons/typescript.svg';
import markdownSVGstr from '../style/icon/language_icons/markdown.svg';
import powershellSVGstr from '../style/icon/language_icons/powershell.svg';

/**
 * List of languages supported by JupyterLab
 */
export const SUPPORTED_LANGUAGES = [
  'Python',
  'Java',
  'R',
  'Julia',
  'Matlab',
  'Octave',
  'Scheme',
  'Processing',
  'Scala',
  'Groovy',
  'Agda',
  'Fortran',
  'Haskell',
  'Ruby',
  'TypeScript',
  'JavaScript',
  'CoffeeScript',
  'LiveScript',
  'C#',
  'F#',
  'Go',
  'Galileo',
  'Gfm',
  'Erlang',
  'PARI/GP',
  'Aldor',
  'OCaml',
  'Forth',
  'Perl',
  'PHP',
  'Scilab',
  'bash',
  'zsh',
  'Clojure',
  'Hy',
  'Lua',
  'PureScript',
  'Q',
  'Cryptol',
  'C++',
  'Xonsh',
  'Prolog',
  'Common Lisp',
  'Maxima',
  'C',
  'Kotlin',
  'Pike',
  'NodeJS',
  'Singular',
  'TaQL',
  'Coconut',
  'Babel',
  'Clojurescript',
  'sbt',
  'Guile',
  'SAS',
  'Stata',
  'Racekt',
  'SQL',
  'HiveQL',
  'Rust',
  'Rascal',
  'Q#',
  'Markdown',
  'Powershell',
];

/**
 * Language icons
 */
export const babelIcon = new LabIcon({
  name: 'custom-ui-components:babel',
  svgstr: babelSVGstr,
});

export const javaIcon = new LabIcon({
  name: 'custom-ui-components:java',
  svgstr: javaSVGstr,
});

export const juliaIcon = new LabIcon({
  name: 'custom-ui-components:julia',
  svgstr: juliaSVGstr,
});

export const matlabIcon = new LabIcon({
  name: 'custom-ui-components:matlab',
  svgstr: matlabSVGstr,
});

export const schemeIcon = new LabIcon({
  name: 'custom-ui-components:scheme',
  svgstr: schemeSVGstr,
});

export const processingIcon = new LabIcon({
  name: 'custom-ui-components:processing',
  svgstr: processingSVGstr,
});

export const scalaIcon = new LabIcon({
  name: 'custom-ui-components:scala',
  svgstr: scalaSVGstr,
});

export const groovyIcon = new LabIcon({
  name: 'custom-ui-components:groovy',
  svgstr: groovySVGstr,
});

export const fortranIcon = new LabIcon({
  name: 'custom-ui-components:fortran',
  svgstr: fortranSVGstr,
});

export const haskellIcon = new LabIcon({
  name: 'custom-ui-components:haskell',
  svgstr: haskellSVGstr,
});

export const rubyIcon = new LabIcon({
  name: 'custom-ui-components:ruby',
  svgstr: rubySVGstr,
});

export const typescriptIcon = new LabIcon({
  name: 'custom-ui-components:typescript',
  svgstr: typescriptSVGstr,
});

export const javascriptIcon = new LabIcon({
  name: 'custom-ui-components:javascript',
  svgstr: javascriptSVGstr,
});

export const coffeescriptIcon = new LabIcon({
  name: 'custom-ui-components:coffeescript',
  svgstr: coffeescriptSVGstr,
});

export const livescriptIcon = new LabIcon({
  name: 'custom-ui-components:livescript',
  svgstr: livescriptSVGstr,
});
export const csharpIcon = new LabIcon({
  name: 'custom-ui-components:csharp',
  svgstr: csharpSVGstr,
});

export const fsharpIcon = new LabIcon({
  name: 'custom-ui-components:fsharp',
  svgstr: fsharpSVGstr,
});

export const goIcon = new LabIcon({
  name: 'custom-ui-components:go',
  svgstr: goSVGstr,
});

export const erlangIcon = new LabIcon({
  name: 'custom-ui-components:erlang',
  svgstr: erlangSVGstr,
});

export const ocamlIcon = new LabIcon({
  name: 'custom-ui-components:ocaml',
  svgstr: ocamlSVGstr,
});

export const forthIcon = new LabIcon({
  name: 'custom-ui-components:forth',
  svgstr: forthSVGstr,
});

export const perlIcon = new LabIcon({
  name: 'custom-ui-components:perl',
  svgstr: perlSVGstr,
});

export const phpIcon = new LabIcon({
  name: 'custom-ui-components:php',
  svgstr: phpSVGstr,
});

export const clojureIcon = new LabIcon({
  name: 'custom-ui-components:clojure',
  svgstr: clojureSVGstr,
});

export const luaIcon = new LabIcon({
  name: 'custom-ui-components:lua',
  svgstr: luaSVGstr,
});

export const purescriptIcon = new LabIcon({
  name: 'custom-ui-components:purescript',
  svgstr: purescriptSVGstr,
});

export const cppIcon = new LabIcon({
  name: 'custom-ui-components:cpp',
  svgstr: cppSVGstr,
});

export const prologIcon = new LabIcon({
  name: 'custom-ui-components:prolog',
  svgstr: prologSVGstr,
});

export const lispIcon = new LabIcon({
  name: 'custom-ui-components:lisp',
  svgstr: lispSVGstr,
});

export const cIcon = new LabIcon({
  name: 'custom-ui-components:c',
  svgstr: cSVGstr,
});

export const kotlinIcon = new LabIcon({
  name: 'custom-ui-components:kotlin',
  svgstr: kotlinSVGstr,
});

export const nodejsIcon = new LabIcon({
  name: 'custom-ui-components:nodejs',
  svgstr: nodejsSVGstr,
});

export const sasIcon = new LabIcon({
  name: 'custom-ui-components:sas',
  svgstr: sasSVGstr,
});

export const coconutIcon = new LabIcon({
  name: 'custom-ui-components:coconut',
  svgstr: coconutSVGstr,
});

export const sbtIcon = new LabIcon({
  name: 'custom-ui-components:sbt',
  svgstr: sbtSVGstr,
});

export const rustIcon = new LabIcon({
  name: 'custom-ui-components:rust',
  svgstr: rustSVGstr,
});

export const qsharpIcon = new LabIcon({
  name: 'custom-ui-components:qsharp',
  svgstr: qsharpSVGstr,
});

export const markdownIcon = new LabIcon({
  name: 'custom-ui-components:markdown',
  svgstr: markdownSVGstr,
});

export const powershellIcon = new LabIcon({
  name: 'custom-ui-components:powershell',
  svgstr: powershellSVGstr,
});

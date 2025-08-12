{ pkgs, ... }:

{
  packages = with pkgs; [ git ];

  languages.javascript.enable = true;
  languages.javascript.yarn.enable = true;
  languages.typescript.enable = true;
}

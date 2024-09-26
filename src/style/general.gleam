import gleam/int
import gleam/list

import metadata.{type Metadata}

pub type Styles =
  List(#(String, String))

pub fn padding(metadata _metadata: Metadata) -> Styles {
  [#("padding", "0.75em")]
}

pub fn margin(metadata _metadata: Metadata) -> Styles {
  [#("margin", "0.75em")]
}

pub fn spacing(metadata metadata: Metadata) -> Styles {
  [padding(metadata:), margin(metadata:)] |> list.concat
}

pub fn rounded(metadata _metadata: Metadata) -> Styles {
  [#("border-radius", "1em")]
}

pub fn depth(metadata metadata: Metadata, hue hue: Int) -> Styles {
  let luma = int.min(metadata.depth * 5 + 10, 100)
  let background_color =
    "hsl(" <> int.to_string(hue) <> ", 100%, " <> int.to_string(luma) <> "%)"

  [#("background-color", background_color)]
}

pub fn page(hue hue: Int) -> Styles {
  let background_color = "hsl(" <> int.to_string(hue) <> ", 100%, 5%)"

  [
    #("background-color", background_color),
    #("position", "absolute"),
    #("top", "0"),
    #("left", "0"),
    #("height", "100%"),
    #("width", "100%"),
  ]
}

pub fn min_width(min_width min_width: Int) -> Styles {
  let min_width = int.to_string(min_width) <> "em"

  [#("min-width", min_width)]
}

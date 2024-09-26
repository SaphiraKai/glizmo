import gleam/int
import gleam/list

import metadata.{type Metadata}
import style/general.{type Styles}

pub type ParagraphStyles {
  ParagraphStyles(paragraph: fn(Metadata) -> Styles)
}

pub fn new(hue hue: Int, font_family font_family: String) -> ParagraphStyles {
  let hue = hue % 360

  let paragraph = paragraph(_, font_family:, hue:)

  ParagraphStyles(paragraph:)
}

fn paragraph(
  metadata metadata: Metadata,
  hue hue: Int,
  font_family font_family: String,
) -> Styles {
  let color = "hsl(" <> int.to_string(hue) <> ", 100%, 85%)"

  let styles = [#("font-family", font_family), #("color", color)]

  [
    general.depth(metadata:, hue:),
    general.padding(metadata:),
    general.rounded(metadata:),
    styles,
  ]
  |> list.concat
}

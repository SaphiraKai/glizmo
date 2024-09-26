import gleam/list
import gleam/string

import metadata.{type Metadata, Metadata}
import style/font.{type FontStyles}
import style/general.{
  type Styles, depth, margin, min_width, padding, page, rounded,
}
import style/part.{type PartStyles}

pub type StyleConfig {
  StyleConfig(
    padding: fn(Metadata) -> Styles,
    margin: fn(Metadata) -> Styles,
    rounded: fn(Metadata) -> Styles,
    depth: fn(Metadata) -> Styles,
    font: FontStyles,
    part: PartStyles,
    page: fn() -> Styles,
    min_width: fn(Int) -> Styles,
  )
}

pub fn new(hue hue: Int, font_family font_family: List(String)) -> StyleConfig {
  let font_family =
    font_family |> list.map(fn(a) { "\"" <> a <> "\"" }) |> string.join(", ")

  let font = font.new(font_family:)
  let part = part.new(font_family:, hue:)

  StyleConfig(
    padding:,
    margin:,
    rounded:,
    depth: depth(_, hue:),
    font:,
    part:,
    page: fn() { page(hue:) },
    min_width:,
  )
}

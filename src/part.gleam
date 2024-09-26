import gleam/list
import gleam/option.{type Option, None, Some}

import lustre/attribute
import lustre/element.{type Element}
import lustre/element/html

import message.{type Msg}
import metadata.{type Metadata, Metadata}
import part/builder.{type PartBuilder}
import style.{type StyleConfig}

pub type Part {
  Column(metadata: Metadata, inner: List(Part))
  Row(metadata: Metadata, inner: List(Part))
  Paragraph(metadata: Metadata, title: Option(String), body: String)
  Button(metadata: Metadata, contents: Part)
}

pub fn from_builder(builder: PartBuilder) -> Part {
  do_from_builder(builder, 0)
}

fn do_from_builder(builder: PartBuilder, depth: Int) {
  case builder {
    builder.Column(id, attributes, inner) ->
      Column(
        metadata: Metadata(id:, depth:, attributes:),
        inner: inner |> list.map(do_from_builder(_, depth + 1)),
      )
    builder.Row(id, attributes, inner) ->
      Row(
        metadata: Metadata(id:, depth:, attributes:),
        inner: inner |> list.map(do_from_builder(_, depth + 1)),
      )
    builder.Paragraph(id, attributes, title, body) ->
      Paragraph(metadata: Metadata(id:, depth:, attributes:), title:, body:)
    builder.Button(id, attributes, contents) ->
      Button(
        metadata: Metadata(id:, depth:, attributes:),
        contents: do_from_builder(contents, depth),
      )
  }
}

pub fn view(styles styles: StyleConfig, part part: Part) -> Element(Msg) {
  case part {
    Column(metadata, inner) -> view_column(metadata:, styles:, inner:)
    Row(metadata, inner) -> view_row(metadata:, styles:, inner:)
    Paragraph(metadata, title, body) ->
      view_paragraph(metadata:, styles:, title:, body:)
    Button(metadata, contents) -> view_button(metadata:, styles:, contents:)
  }
}

fn view_column(
  metadata metadata: Metadata,
  styles styles: StyleConfig,
  inner inner: List(Part),
) -> Element(Msg) {
  let length = list.length(inner)
  let elements =
    inner
    |> list.index_map(fn(a, i) {
      let style = case i == length - 1 {
        True -> styles.part.column.last_item()
        False -> styles.part.column.item()
      }

      html.div([attribute.style(style)], [view(a, styles:)])
    })

  html.div(
    [
      styles.part.column.column(metadata) |> attribute.style,
      ..metadata.attributes
    ],
    elements,
  )
}

fn view_row(
  metadata metadata: Metadata,
  styles styles: StyleConfig,
  inner inner: List(Part),
) -> Element(Msg) {
  let length = list.length(inner)
  let elements =
    inner
    |> list.index_map(fn(a, i) {
      let style = case i == length - 1 {
        True -> styles.part.row.last_item()
        False -> styles.part.row.item()
      }

      html.div([attribute.style(style)], [view(a, styles:)])
    })

  html.div(
    [styles.part.row.row(metadata) |> attribute.style, ..metadata.attributes],
    elements,
  )
}

fn view_paragraph(
  metadata metadata: Metadata,
  styles styles: StyleConfig,
  title title: Option(String),
  body body: String,
) -> Element(Msg) {
  let elements = [html.p([], [element.text(body)])]

  let elements = case title {
    Some(title) -> [
      html.p([attribute.style(styles.font.title())], [element.text(title)]),
      ..elements
    ]
    None -> elements
  }

  html.div(
    [
      styles.part.paragraph.paragraph(metadata) |> attribute.style,
      ..metadata.attributes
    ],
    elements,
  )
}

fn view_button(
  metadata metadata: Metadata,
  styles styles: StyleConfig,
  contents contents: Part,
) -> Element(Msg) {
  html.button(metadata.attributes, [view(styles:, part: contents)])
}

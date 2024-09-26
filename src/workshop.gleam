import gleam/option.{None, Some}
import lustre/attribute

import lustre
import lustre/effect.{type Effect}
import lustre/element.{type Element}
import lustre/element/html

import message.{type Msg}
import part.{type Part}
import part/builder.{Button, Column, Paragraph, Row}
import style.{type StyleConfig}

pub type Model {
  Model(body: Part, styles: StyleConfig)
}

pub fn init(hue: Int, font_family: List(String)) -> #(Model, Effect(a)) {
  let styles = style.new(hue:, font_family:)

  let min_width = styles.min_width(16) |> attribute.style

  let body =
    part.from_builder(
      Row(id: "body", attributes: [], inner: [
        Column(id: "first column", attributes: [], inner: [
          Paragraph(
            id: "paragraph 1",
            attributes: [min_width],
            title: Some("title 1"),
            body: "body 1",
          ),
          Paragraph(
            id: "paragraph 2",
            attributes: [min_width],
            title: Some("title 2"),
            body: "body 2",
          ),
          Paragraph(
            id: "paragraph 3",
            attributes: [min_width],
            title: Some("title 3"),
            body: "body 3",
          ),
          Button(
            id: "button",
            attributes: [],
            contents: Paragraph(
              id: "button text",
              attributes: [],
              title: None,
              body: "button",
            ),
          ),
        ]),
        Paragraph(
          id: "outside paragraph",
          attributes: [min_width],
          title: Some("title"),
          body: "body",
        ),
      ]),
    )

  #(Model(body:, styles:), effect.none())
}

pub fn update(model: Model, _msg: a) -> #(Model, Effect(a)) {
  #(model, effect.none())
}

pub fn view(model: Model) -> Element(Msg) {
  html.div([attribute.style(model.styles.page())], [
    part.view(styles: model.styles, part: model.body),
  ])
}

pub fn main() {
  let init = fn(_) { init(330, ["Comfortaa", "Sans Serif"]) }

  let app = lustre.application(init, update, view)
  let assert Ok(_) = lustre.start(app, "#app", [])
}

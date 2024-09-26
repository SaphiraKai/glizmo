import gleam/option.{type Option}

import lustre/attribute.{type Attribute}

import message.{type Msg}

pub type PartBuilder {
  Column(id: String, attributes: List(Attribute(Msg)), inner: List(PartBuilder))
  Row(id: String, attributes: List(Attribute(Msg)), inner: List(PartBuilder))
  Paragraph(
    id: String,
    attributes: List(Attribute(Msg)),
    title: Option(String),
    body: String,
  )
  Button(id: String, attributes: List(Attribute(Msg)), contents: PartBuilder)
}

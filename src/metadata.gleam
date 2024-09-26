import lustre/attribute.{type Attribute}

import message.{type Msg}

pub type Metadata {
  Metadata(id: String, depth: Int, attributes: List(Attribute(Msg)))
}

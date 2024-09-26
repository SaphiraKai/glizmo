import gleam/list

import metadata.{type Metadata}
import style/general.{type Styles}

pub type ColumnStyles {
  ColumnStyles(
    column: fn(Metadata) -> Styles,
    item: fn() -> Styles,
    last_item: fn() -> Styles,
  )
}

pub fn new(hue hue: Int) -> ColumnStyles {
  ColumnStyles(column: column(_, hue:), item:, last_item:)
}

fn column(metadata metadata: Metadata, hue hue: Int) -> Styles {
  let styles = [#("display", "flex"), #("flex-direction", "column")]

  [
    general.depth(metadata:, hue:),
    general.padding(metadata:),
    general.rounded(metadata:),
    styles,
  ]
  |> list.concat
}

fn item() -> Styles {
  [#("margin-bottom", "0.75em")]
}

fn last_item() -> Styles {
  []
}

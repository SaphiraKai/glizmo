import gleam/list

import metadata.{type Metadata}
import style/general.{type Styles}

pub type RowStyles {
  RowStyles(
    row: fn(Metadata) -> Styles,
    item: fn() -> Styles,
    last_item: fn() -> Styles,
  )
}

pub fn new(hue hue: Int) -> RowStyles {
  RowStyles(row: row(_, hue:), item:, last_item:)
}

fn row(metadata metadata: Metadata, hue hue: Int) -> Styles {
  let styles = [#("display", "flex"), #("flex-direction", "row")]

  [
    general.depth(metadata:, hue:),
    general.padding(metadata:),
    general.rounded(metadata:),
    styles,
  ]
  |> list.concat
}

fn item() -> Styles {
  [#("margin-right", "0.75em")]
}

fn last_item() -> Styles {
  []
}

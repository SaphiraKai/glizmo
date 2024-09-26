import gleam/list

pub type FontStyles {
  FontStyles(
    bold: fn() -> Styles,
    family: fn() -> Styles,
    title: fn() -> Styles,
  )
}

type Styles =
  List(#(String, String))

pub fn new(font_family font_family: String) -> FontStyles {
  let family = fn() { family(font_family) }

  FontStyles(bold:, family:, title:)
}

fn family(font_family: String) -> Styles {
  [#("font-family", font_family)]
}

fn bold() -> Styles {
  [#("font-weight", "bold")]
}

fn title() -> Styles {
  let styles = [#("font-size", "1.25em")]

  [bold(), styles] |> list.concat
}

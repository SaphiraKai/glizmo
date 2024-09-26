import gleam/list

import style/general.{type Styles}

pub type ButtonStyles {
  ButtonStyles(button: fn() -> Styles)
}

pub fn new(hue hue: Int) -> ButtonStyles {
  ButtonStyles(button:)
}

fn button() -> Styles {
  []
}

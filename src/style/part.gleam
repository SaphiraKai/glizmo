import style/part/button.{type ButtonStyles}
import style/part/column.{type ColumnStyles}
import style/part/paragraph.{type ParagraphStyles}
import style/part/row.{type RowStyles}

pub type PartStyles {
  PartStyles(
    column: ColumnStyles,
    row: RowStyles,
    paragraph: ParagraphStyles,
    button: ButtonStyles,
  )
}

pub fn new(font_family font_family: String, hue hue: Int) -> PartStyles {
  let column = column.new(hue:)
  let row = row.new(hue:)
  let button = button.new(hue:)
  let paragraph = paragraph.new(font_family:, hue:)

  PartStyles(column:, row:, button:, paragraph:)
}

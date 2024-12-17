def format_text(text):
  return text.replace(' ', '\n')

if __name__ == "__main__":
  input_text = input("Introduce el texto separado por espacios: ")
  formatted_text = format_text(input_text)
  print(formatted_text)


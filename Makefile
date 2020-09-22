filename=stylesheet

all: stylesheet

.PHONY: stylesheet
stylesheet:
	@echo "Creating Stylesheet..."
	@sass $(filename).scss $(filename).css

clean:
	@echo "Removing compiled stylesheet"
	@rm $(filename).css $(filename).css.map

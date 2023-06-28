OUTDIR = docs

build: src/index.html src/*.css src/*.jsx src/*.mdx build.mjs
	mkdir -p $(OUTDIR)
	cp src/*.css $(OUTDIR)/
	cp -r src/fonts $(OUTDIR)/
	cp -r src/img $(OUTDIR)/
	cp src/index.html $(OUTDIR)/
	node build.mjs src/main.jsx

clean:
	rm $(OUTDIR)/*

.PHONY: clean build

# BEM helper CLI tool

Tool for helping to create folder&files structure in bem-based projects.

## Installation

```bash
npm install artprog@bem-helper
```

## Usage

### Create block file structure

```bash
npx bem-helper -b block-name1,block-name2,...
```

It will create folders for block with pug and scss files

### Create element file structure

```bash
npx bem-helper -b block-name -e element-name1,element-name2
```

It will create folders for elements inside block with pug and scss files

### Create block modifier

```bash
npx bem-helper -b block-name -m modifier-name1,modifier-name2
```

### Create element modifier

```bash
npx bem-helper -b block-name -e element-name -m modifier-name1,modifier-name2
```

## Examples

```bash
npx bem-helper -b nav
```

```bash
npx bem-helper -b nav,header,footer
```

```bash
npx bem-helper -b nav -e item
```

```bash
npx bem-helper -b nav -e item -m active
```

```bash
npx bem-helper -b nav -e item -m color_primary,color_secondary
```

### Customize templates and paths

To customize paths check file:

```
[your-project-path]/node_modules/bem-helper/
```

### BTC Donation

BTC Address: **bc1qm395pj4eyqfu7dd2u36hggzjv56j58mppvrna6**

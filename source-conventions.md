# 소스 구조 및 명명 규약

> 상태: 정본(Normative)
>
> 적용 범위: Musecat3-Next, UIKit, FunctionKit의 TypeScript/React 소스

이 문서는 공통 source grammar를 정의한다. 저장소별 문서는 제약을 추가할 수 있지만
이 규칙을 다시 정의할 수 없다. 기존에 어긋나는 경로는
[`migration/`](./migration/README.md) 항목이지 새로운 선례가 아니다.

## 핵심 원칙

경로는 소유권을, 모듈은 namespace를, symbol은 즉시 역할을 표현한다. 전체 경로를 모든
identifier에 반복하지 않는다.

```ts
import * as BasicEdit from "@/frontend/services/arcade/BasicEdit/BasicEdit";

<BasicEdit.Page />;
await BasicEdit.submit(input);
```

다음처럼 경로를 symbol에 다시 인코딩하지 않는다.

```ts
Arcade_BasicEdit_submit();
ArcadeBasicEditSubmit();
ArcadeBasicEditFlow();
```

## 디렉터리 이름

### 구조·그룹 디렉터리

구조 디렉터리는 소문자로 시작한다. 한 단어는 lowercase, 여러 단어는 lower camel case를
사용한다.

```text
components/
contracts/
hooks/
providers/
renderers/
routeAdapters/
services/
styles/
gameSeries/
openGraph/
```

TypeScript source 디렉터리에 kebab-case나 snake_case를 사용하지 않는다.

### 이름 있는 공개 모듈

공개 subject를 나타내며 독립된 facade가 필요한 디렉터리만 PascalCase를 사용한다.

```text
services/
  arcade/
    BasicEdit/
      BasicEdit.ts

components/
  Dialog/
    Dialog.tsx
```

`arcade`는 그룹 경계이고 `BasicEdit`은 import 가능한 모듈이다. React component를
포함한다는 이유만으로 디렉터리를 PascalCase로 만들지 않는다.

### source root

`src/`를 강제하지 않는다. 저장소는 목적이 명확하면 `app/`, `backend/`, `frontend/`,
`packages/` 같은 root를 유지할 수 있다. UIKit과 FunctionKit의 `packages/`는 내부 기능
모듈 집합이며 반드시 여러 배포 단위를 뜻하지 않는다.

### 금지 bucket

`misc`, `stuff`, `helpers`, 무제한 `common`은 금지한다. `shared`는 명시적 architecture
boundary이거나 모듈 내부의 좁은 공동 소유권일 때만 허용한다.

## 파일 이름 grammar

다음 순서를 사용한다.

```text
<Subject>[.<role>][.<runtime>][.<artifact>].<extension>
```

```text
BasicEdit.ts
BasicEdit.form.tsx
BasicEdit.routeModal.tsx
BasicEdit.submit.ts
BasicEdit.validation.ts
OpenGraph.assets.server.ts
SupportDocs.query.server.ts
BasicEdit.form.test.tsx
Dialog.fixture.tsx
Dialog.stories.tsx
```

- named module과 React component subject는 PascalCase를 사용한다.
- 독립 함수·hook 파일은 주 export와 같은 lower camel case를 사용한다.
- dot role은 lower camel case를 사용한다: `.routeModal`, `.routemodal` 금지.
- runtime qualifier는 `.client`, `.server`이며 role 뒤에 둔다. standalone runtime adapter처럼
  이름만으로 실행 환경이 모호할 때 사용한다.
- `.test`, `.fixture`, `.stories` 같은 artifact는 마지막에 둔다.
- JSX가 있을 때만 `.tsx`를 사용한다.
- universal 파일은 일반 `.ts(x)`를 사용한다. `.shared.ts(x)`는 금지한다.
- Client Component와 `use` hook은 `"use client"`가 필수이며 이름과 category가 runtime을
  충분히 설명하면 `.client` suffix를 반복하지 않는다.
- script와 config는 platform이 요구하는 확장자·이름을 따른다.

권장 role 어휘는 다음과 같다.

| Role | 의미 |
| --- | --- |
| `.types` | 모듈이 소유하는 type-only 계약 |
| `.constants` | runtime 정책이 없는 안정된 값 |
| `.validation` | 입력 검증과 검증 오류 |
| `.schema` | schema library를 실제 사용하는 runtime schema |
| `.mapper` | 이름 있는 두 표현 사이의 변환 |
| `.adapter` | 경계나 protocol 사이의 번역 |
| `.store` | client state container |
| `.query` | read orchestration |
| `.mutation` | 더 정확한 동사가 없을 때의 write orchestration |
| `.server` | server-only 구현 |
| `.client` | client-only 구현 |
| `.page` | 재사용 가능한 page surface adapter |
| `.dialog` | 완성된 Dialog surface adapter |
| `.routeModal` | `app`에서 Dialog를 navigation/interception에 연결하는 Next.js adapter |

`.utils`, `.helpers`, `.manager`, `.flow`처럼 책임을 숨기는 suffix를 피한다. `.policy`,
`.format`, `.mapper`, `.validation`, `.store` 또는 정확한 동사를 사용한다.

Next.js가 소유하는 `page.tsx`, `layout.tsx`, `route.ts`, `loading.tsx`, `error.tsx`,
`not-found.tsx`, `default.tsx`, `opengraph-image.tsx`, `sitemap.ts`, `manifest.ts`는 예외다.

## 모듈 형태

책임이 경계를 필요로 할 만큼 분리될 때만 모듈 디렉터리를 만든다. 작은 응집 구현은 한
파일로 둔다.

```text
frontend/
  services/
    arcade/
      BasicEdit/
        BasicEdit.ts
        BasicEdit.form.tsx
        BasicEdit.page.tsx
        BasicEdit.dialog.tsx
        BasicEdit.submit.ts
        BasicEdit.validation.ts
        BasicEdit.types.ts
        hooks/
          useForm.ts
          useSubmit.ts
```

이 목록은 사용할 수 있는 어휘이지 모든 파일을 만들라는 template가 아니다.

### Facade 허용 조건

다음 조건을 모두 만족할 때 same-named facade를 둔다.

1. 외부 소비자가 사용할 두 개 이상의 독립 공개 역할이 있다.
2. 내부 파일 graph를 호환성 계약에서 숨길 가치가 있다.
3. facade 이름이 공개 module subject와 같다.
4. export 목록을 의도적으로 review할 owner가 있다.

```ts
export { Actions } from "./BasicEdit.actions";
export { Content } from "./BasicEdit.content";
export { Dialog } from "./BasicEdit.dialog";
export { Page } from "./BasicEdit.page";
export { submit } from "./BasicEdit.submit";
export type { Input, Result } from "./BasicEdit.types";
```

facade는 explicit export만 사용한다. 임의 `index.ts` barrel과 `export *`는 금지한다.
`index.ts`는 npm package root나 tooling이 명시적으로 entry point로 정의한 곳에서만
허용한다.

### Import 규칙

모듈 외부에서는 facade를 사용한다.

```ts
import * as BasicEdit from "@/frontend/services/arcade/BasicEdit/BasicEdit";
```

모듈 내부에서는 concrete sibling을 직접 사용한다.

```ts
import { submit } from "./BasicEdit.submit";
import { useForm } from "./hooks/useForm";
```

- cross-module deep import는 금지한다.
- 모듈 내부 relative import, architecture boundary 사이 `@/` absolute import를 권장한다.
- type-only import에는 `import type`을 사용한다.
- 초기화 side effect가 있는 barrel에 의존하지 않는다.
- `frontend`에서 `backend`를 import하지 않는다.

## Symbol 이름

모듈 namespace 안에서는 역할만 간결하게 표현한다.

```ts
// BasicEdit.page.tsx
export function Page() {}

// BasicEdit.submit.ts
export async function submit(input: Input) {}

// BasicEdit.validation.ts
export function validate(input: Input) {}
```

- React component와 type은 PascalCase를 사용한다.
- 함수와 값은 lower camel case를 사용한다.
- hook은 `use`로 시작한다.
- boolean은 `is`, `has`, `can`, `should`로 시작한다.
- callback prop은 `on`, 그 local event 구현은 `handle`로 시작할 수 있다.
- framework가 요구하는 route default export 외에는 named export를 사용한다.

동사는 다음 계약을 따른다.

| 동사 | 계약 |
| --- | --- |
| `get` | 값을 얻는다. 문서화된 local cache를 사용할 수 있다. |
| `fetch` | remote 또는 I/O read를 수행한다. |
| `create`, `update`, `delete` | domain mutation을 수행한다. |
| `read`, `write` | storage-level I/O를 수행한다. |
| `parse` | 신뢰하지 않는 입력을 변환하고 invalid 입력을 보고한다. |
| `validate` | 작업을 수행하지 않고 계약을 확인한다. |
| `map` | 알려진 한 표현을 다른 표현으로 변환한다. |
| `format` | I/O 없이 표시용 출력을 만든다. |
| `resolve` | 규칙과 fallback으로 값을 선택·도출한다. |
| `build` | 새로운 복합 값을 조립한다. |
| `ensure` | postcondition을 보장하거나 명시적으로 실패한다. |
| `handle` | local UI event에 응답한다. |

`Manager`, `Helper`, `Processor`, `Handler`, `Utils`를 domain 동사 대신 사용하지 않는다.
`Handler`는 framework가 정의한 handler 개념과 실제 event boundary에는 허용한다.

## Package 공개 API

UIKit과 FunctionKit 소비자는 package root named export를 기본으로 사용한다.

```ts
import { Dialog, ThemeBootstrapper } from "@musecat/uikit";
import {
  normalizeUploadImage,
  useKeyboardListNavigation,
} from "@musecat/functionkit";
```

- package 이름을 symbol에 다시 붙이지 않는다.
- root에서 너무 일반적인 `normalize`, `format`, `useState` 같은 이름을 export하지 않는다.
- root barrel과 `package.json#exports`는 supported entry를 explicit하게 열거한다.
- wildcard public export는 금지한다.
- stylesheet와 런타임 격리에 필요한 subpath는 별도 문서화하고 explicit하게 연다.
- 내부 directory layout은 호환성 계약이 아니다.

## Hook 배치

모듈이 hook 하나를 소유하면 module 파일 옆에 subject-role grammar로 둔다.

```text
BasicEdit.useForm.ts
```

hook이 둘 이상이면 `hooks/`를 만들고 디렉터리가 module 문맥을 제공하게 한다.

```text
hooks/
  useForm.ts
  useSubmit.ts
```

실제 소비자가 둘 이상이고 동작이 제품 중립일 때만 FunctionKit으로 승격한다.

## 런타임과 dependency boundary

장기 dependency 방향은 다음과 같다.

```text
app ──> backend/services ──> backend/providers
app ──> frontend ─────────> UIKit
backend/services ─────────> FunctionKit
frontend ─────────────────> FunctionKit
app/backend/frontend ─────> shared/contracts
backend/frontend ─────────> shared/domain
```

세부 소유권은 [백엔드](./backend.md), [프론트엔드](./frontend.md),
[Next.js](./nextjs.md) 규약을 따른다.

server-only와 client-only 경계는 ambiguous할 때 파일명과 marker 양쪽에서 보이게 한다.
facade가 server 코드를 client graph에서 도달 가능하게 만들면 안 된다.

## Page, Dialog, Route Modal

제품 content는 modal 없이 작동해야 한다.

- `Page`는 완성된 page surface다.
- `Dialog`는 feature의 Header, Content, Actions와 Dialog 설정을 완전히 조합한다.
- `app`의 `RouteModal`은 완성된 Dialog를 navigation과 interception에 연결한다.
- intercepted `page.tsx`는 data를 읽고 `RouteModal`을 렌더링한다.
- UIKit은 Next.js route interception을 알지 않는다.

`Content`만 route modal에 넣어 feature header, actions, dismissal policy를 잃지 않는다.
자세한 계약은 [UIKit](./uikit.md), [프론트엔드](./frontend.md),
[Next.js](./nextjs.md)를 따른다.

## Logic 구성

- pure parsing, validation, mapping, formatting을 I/O와 분리한다.
- 외부 SDK 세부는 provider에서 처리하고 service를 넘기기 전에 mapping한다.
- side effect는 명시적 boundary에 둔다.
- 가장 가까운 공통 owner가 state를 가진다.
- backend는 typed domain result 또는 문서화된 domain error를 반환한다.
- 짧은 orchestration은 `parse -> validate -> execute -> map`으로 읽혀야 한다.
- line count가 아니라 독립 계약이 있을 때 파일을 분리한다.

## Style 소유권

Musecat 애플리케이션은 local CSS/SCSS module을 추가하지 않는다. UIKit component, token,
responsive contract, composition prop을 사용한다. 누락된 시각 기능은 UIKit API 요청이다.

UIKit만 문서화된 style boundary 안에서 SCSS를 소유할 수 있다. FunctionKit은 product
style을 소유하지 않는다. OpenGraph ImageResponse의 Satori-compatible inline style은
server rendering 제약에 한정된 예외다.

## 테스트와 진단 surface

테스트는 검증하는 계약 옆에 둔다.

```text
BasicEdit.validation.ts
BasicEdit.validation.test.ts
Dialog.tsx
Dialog.test.tsx
Dialog.fixture.tsx
Dialog.stories.tsx
```

cross-module integration과 E2E만 별도 test 디렉터리를 사용한다. fixture는 실행 가능한
진단 UI, story는 공개 component 문서다. 둘을 검증되지 않은 구현 entry로 사용하지 않는다.

## Review checklist

1. 경로가 실제 owner를 말하는가?
2. 구조 디렉터리는 lower camel case, 공개 module은 PascalCase인가?
3. 파일이 subject, role, runtime, artifact 순서를 따르는가?
4. symbol이 경로와 module 문맥을 반복하지 않는가?
5. 외부 소비자가 curated facade 또는 package export를 사용하는가?
6. server/client와 backend/frontend dependency 방향이 유지되는가?
7. Page, Dialog, Route Modal 책임이 분리되는가?
8. UIKit 또는 FunctionKit 기능을 local로 복제하지 않는가?
9. comment가 dead code가 아니라 계약과 이유를 설명하는가?
10. 테스트가 contract 옆에 있고 reference가 같은 변경에서 갱신되는가?

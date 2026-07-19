# 작성 및 포맷 규약

> 상태: 정본(Normative)
>
> 적용 범위: 세 저장소의 소스 주석, Markdown, 변경 기록, 코드 포맷

## 문서 상태를 먼저 밝힌다

모든 설계·운영 Markdown은 제목 바로 아래에서 상태와 적용 범위를 밝힌다.

```md
# 문서 제목

> 상태: 정본(Normative)
>
> 적용 범위: 이 규약이 구속하는 저장소와 모듈
```

허용 상태는 다음과 같다.

| 상태 | 의미 | 위치 |
| --- | --- | --- |
| 정본(Normative) | 신규 코드와 review를 구속하는 현재 규약 | `/docs` |
| Reference | checked-in 구현과 공개 API의 사용 설명 | 각 패키지 `.agents/references` |
| Migration | 현재 위반, 순서, 완료 조건 | `/docs/migration` |
| Historical | 더 이상 적용하지 않는 결정의 근거 | 필요한 경우 별도 archive |

정본 문서에는 `검토 중`, `추후 결정`, 작업 순서를 넣지 않는다. 결정되지 않은 항목은
Migration 문서에서 owner와 완료 조건을 가진 항목으로 관리한다.

## 규범 어휘

- **MUST / 반드시**: 예외 없는 요구사항이다.
- **MUST NOT / 금지한다**: 허용하지 않는 동작이다.
- **SHOULD / 권장한다**: 합리적 예외가 가능하지만 이유를 review에 남겨야 한다.
- **MAY / 허용한다**: 계약 안에서 선택할 수 있다.

`가능하면`, `적당히`, `필요시`처럼 판정 기준이 없는 표현을 피한다. 예외가 있다면
조건, 범위, owner, 제거 조건을 함께 적는다.

## Markdown 포맷

- UTF-8과 LF를 사용한다.
- 파일에는 H1을 하나만 둔다. 하위 heading level을 건너뛰지 않는다.
- ATX heading(`#`)을 사용하고 heading 전후에 빈 줄을 둔다.
- 목록 앞뒤와 서로 다른 문단 사이에 빈 줄을 둔다.
- 코드 fence에는 `ts`, `tsx`, `text`, `json`, `scss`, `sh` 등 언어를 명시한다.
- 표는 안정적인 mapping이나 비교에만 사용한다. 긴 설명은 문단과 목록으로 쓴다.
- 링크 text는 목적을 설명해야 하며 `여기`, bare URL을 본문 링크로 사용하지 않는다.
- 저장소 내부 링크는 상대 경로를 사용하고 대소문자를 실제 경로와 맞춘다.
- 이미지에는 의미 있는 대체 text를 제공한다.
- Mermaid는 관계나 lifecycle을 문장보다 명확하게 만들 때만 사용한다.

문서 파일명은 `README.md`를 제외하고 lowercase kebab-case를 사용한다. UIKit과
FunctionKit의 API reference는 공개 subject 이름과 일치하는 PascalCase 또는 실제 export
이름을 사용할 수 있다.

## 문서 내용

문서는 다음 순서로 읽을 수 있어야 한다.

1. 무엇의 정본인지
2. 누가 무엇을 소유하는지
3. 허용·금지되는 계약
4. 최소한의 올바른 예
5. 검증 방법과 관련 문서

코드를 그대로 서술하지 않는다. 기본값, 불변식, 런타임 제한, 실패·cleanup, 이유처럼
타입만으로 알 수 없는 정보를 기록한다.

버전, 파일 목록, 진행률처럼 자주 바뀌는 값은 한 곳에만 둔다. 장기 규약에 특정 버전을
복제하지 말고, 필요한 snapshot은 Migration 문서에서 검증 날짜와 근거를 함께 적는다.

## 예제 코드

- 소비자가 실제 사용할 공개 import만 사용한다.
- deep import, 미공개 helper, 폐기 예정 API를 정상 예제로 제시하지 않는다.
- 필수 prop과 runtime directive를 생략하지 않는다.
- UIKit 예제는 UIKit primitive와 token 규약을 스스로 지켜야 한다.
- FunctionKit 예제는 SSR-safe, client-only, server-only 분류와 일치해야 한다.
- 의사 코드면 `text` fence와 `의사 코드` 표기를 사용한다.
- 생략 때문에 동작하지 않는 예제를 완전한 예제로 표현하지 않는다.

## 소스 주석과 JSDoc

주석은 다음 중 하나를 설명할 때만 쓴다.

- 소유권과 dependency boundary
- 외부 계약으로 인해 지켜야 하는 불변식
- 코드만으로 보이지 않는 trade-off
- 보안·접근성·cleanup 이유
- 임시 migration 항목의 제거 조건

문법을 줄마다 다시 말하거나, 삭제된 코드를 주석으로 보존하지 않는다. 공개 package
API에는 소비자가 알아야 할 기본값, 오류, 런타임, 접근성, lifecycle이 있을 때 JSDoc을
작성한다. sibling 파일 사이에서 export된다는 이유만으로 JSDoc을 강제하지 않는다.

Migration placeholder는 실행 가능한 import/export를 포함하지 않고 최소한 다음을
기록한다.

```text
Legacy responsibility
Previous dependency categories
Target owner or replacement
Behavior that must survive
Deletion condition
```

## 코드 포맷

각 저장소의 checked-in formatter와 `package.json` script 출력이 정본이다.

- 수동 정렬보다 formatter와 import organizer를 실행한다.
- 저장소 간 tab/space 차이를 기능 변경과 함께 대량 정규화하지 않는다.
- 포맷 설정을 바꾸는 변경은 별도 범위로 만들고 전체 diff와 CI 영향을 검증한다.
- `.ts`와 `.tsx`는 JSX 포함 여부로 구분한다.
- type-only import는 `import type`을 사용한다.
- framework가 요구하는 default export 외에는 named export를 사용한다.

## 링크와 최신성

- 정본 인덱스는 [`README.md`](./README.md) 하나다.
- 문서를 이동하면 모든 내부 링크와 reference index를 같은 변경에서 갱신한다.
- 코드와 reference가 다르면 소스·타입·root export로 현재 동작을 확인한 뒤 둘을 즉시
  맞춘다.
- 정본 설계와 현재 코드가 다르면 문서를 현재 코드에 조용히 맞추지 않고
  [`migration/`](./migration/README.md)에 차이를 기록한다.
- 완료되거나 폐기된 queue가 root에 남아 새 규약처럼 읽히게 하지 않는다.

## 문서 review checklist

1. 상태와 적용 범위가 있는가?
2. 정본과 migration을 섞지 않았는가?
3. MUST, SHOULD, MAY를 판정 가능하게 썼는가?
4. 링크가 실제 대소문자와 export를 가리키는가?
5. 예제가 공개 API와 자체 규약을 지키는가?
6. 현재 코드 설명과 목표 설계를 구분했는가?
7. 같은 사실을 여러 문서에 복제하지 않았는가?
8. 변경된 구현·타입·테스트·export·reference를 함께 갱신했는가?

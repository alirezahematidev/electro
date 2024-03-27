mod en;
mod fa;

pub trait Word {
    const EN_NOUNS: &'static [&'static str] = en::nouns::EN_NOUNS;
    const FA_NOUNS: &'static [&'static str] = fa::nouns::FA_NOUNS;
}

pub struct FakeWord;

impl Word for FakeWord {}

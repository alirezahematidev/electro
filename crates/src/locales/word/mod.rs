pub trait Word {
    const EN: &'static [&'static str] = &["verify"];
    const FA: &'static [&'static str] = &["تایید"];
}

pub struct FakeWord;

impl Word for FakeWord {}
